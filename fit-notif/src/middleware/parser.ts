import { Request, Response, NextFunction } from 'express';
import formidable from 'formidable';

const formParserMiddleware = (req: any, res: any, next: any) => {
    const form = formidable({});

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ message: "Erreur lors du parsing des données" });
        }
        
        // Stocker les champs et fichiers dans req pour y accéder dans les prochains middleware
        req.fields = fields;
        req.files = files;
        
        next(); // Passer au middleware suivant
    });
};

export default formParserMiddleware;
