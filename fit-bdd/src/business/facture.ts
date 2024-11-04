import { Prisma, PrismaClient } from "@prisma/client";
import path from "path";
import axios from "axios";

const prisma = new PrismaClient();
const easyinvoice = require('easyinvoice');
const fs = require('fs');
const FormData = require('form-data');

const dayjs = require('dayjs');

const date = dayjs(); // Date actuelle


const AWS = require('aws-sdk');
// Configure AWS S3
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();


class FactureManager{

    async getFactureForUser(userId: number) {
        try {
          const factures = await prisma.facture.findMany({
            where: { userId },
            });
          return {data: factures, statusCode: 201};
        } catch (error) {
          console.error(`Error fetching Facture(s) for user with id ${userId}.:`, error);
          return {message: `Error fetching Facture(s) for user with id ${userId}.`, data: null, statusCode: 400};
        }
    }


    async createFacture(userId: number, data: any) {
        try {
            const invoice = await easyinvoice.createInvoice(data);
            // Écrire la facture dans un fichier local
            const filePath = `./invoice.pdf`;
            fs.writeFileSync(filePath, invoice.pdf, 'base64');
    
            const fileContent = fs.readFileSync(filePath);
    
            // Créer un FormData pour envoyer les données avec la pièce jointe
            const form = new FormData();
    
            form.append('to', data.client.email);
            form.append('subject', `Facture du mois de ${date.format('MMMM')}`);
            form.append('content', `
                FitGoal,
                
                Veuillez retrouver en pièce jointe votre facture du mois de ${date.format('MMMM')}.
                
                Bien cordialement
            `);
    
            // Ajouter la pièce jointe (fichier PDF)
            form.append('attachments', fileContent, {
                filename: `${data.client.company}_${data.invoiceNumber}.pdf`,
                contentType: 'application/pdf'
            });
    
            // Envoyer les données avec Axios
            await axios.post(`${process.env.BACKEND_URL}/mailer/mail/send-email`, form, {
                headers: {
                    ...form.getHeaders() 
                }
            })
            .then(response => {
                console.log("Facture a bien été envoyée par mail");
            })
            .catch(err => {
                console.error("Failed to send invoice: " + err.message);
            });
    
            // Upload sur S3
            const params = {
                Bucket: process.env.S3_BUCKET_NAME, 
                Key: `${data.client.company}_${data.invoiceNumber}.pdf`, 
                Body: fileContent, 
                ContentType: 'application/pdf', 
            };
    
            console.log(params);
    
            const s3Data = await s3.upload(params).promise();
    
            // Enregistrer la facture dans la base de données
            const facture = await prisma.facture.create({
                data: {
                    userId,
                    s3url: `${s3Data.Location}`
                }
            });
    
            // Supprimer le fichier local après l'upload et l'envoi
            fs.unlinkSync(filePath);
    
            return { message: `Facture created successfully.`, data: facture, statusCode: 201 };
        } catch (error) {
            console.error("Error creating facture:", error);
            return { message: `Failed to create facture: ${error}`, data: null, statusCode: 500 };
        }
    }


}

export default FactureManager;