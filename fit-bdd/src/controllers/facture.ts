import { Router } from "express";
import FactureManager from "../business/facture";
import isAuthenticated from "../middlewares/isAuth";


const router = Router();
const factureManager = new FactureManager();

router.get("/", isAuthenticated, async (req, res) => {
      const userId = (req as any).userId;
      if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
      }
      const factures = await factureManager.getFactureForUser(
        parseInt(userId)
      );
      if(factures.statusCode == 200){
        res.status(factures.statusCode).send({data: factures.data});
      }else{
        res.status(factures.statusCode).send({message: factures.message});
      }
    
});


// Create a new Facture
router.post("/:userId", async (req, res) => {
    const { userId } = req.params;
    const { data } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
    }

    const facture = await factureManager.createFacture(parseInt(userId), data);
    if(facture.statusCode == 201){
      res.status(facture.statusCode).send({message: facture.message, data: facture.data});
    }else{
      res.status(facture.statusCode).send({message: facture.message});
    }
  
});


export default router;

