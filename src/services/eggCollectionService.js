import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";

export const eggCollectionService = {
    submitEggCollection: async (eggCollectionData) => {
        try {
          const eggCollectionDocRef = await addDoc(
            collection(db, "eggProduction"),
            {
              eggCollectionData,
            },
            );  
            return eggCollectionDocRef?.id
        } catch (error) {
            console.error("Error creating feed inventory:", error);
            throw error;
        }  
  },
};