const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");
const cors = require("cors");
app.use(express.json());
app.use(cors());


app.get("/earrings", async (req, res) => {
    try {
        const response = await axios.get("https://glammor20240116153727.azurewebsites.net/Earrings");
        res.json(response.data);
    } catch (error) {
        console.error('Fel vid anrop till Minimal API:', error);
        res.status(500).send('Ett fel inträffade vid anrop till Minimal API');
    }
});

app.get("/earring/:id", async (req, res) => {
    try {
        const earringId = parseInt(req.params.id, 10)
        const url = `https://glammor20240116153727.azurewebsites.net/Earring/${earringId}`;
        const response = await axios.get(url);
        if(!response.data){
            return res.status(404).send("Earring not found!")
        }
        res.json(response.data);
    } catch (error) {
        console.error("Fel vid anrop till Minimal API:", error);
        res.status(500).send("Ett fel inträffade vid anrop till Minimal API");
    }
});

app.post("/earring", async (req, res) => {
    try {
        const earringData = req.body; 
        const response = await axios.post('https://glammor20240116153727.azurewebsites.net/Earring', earringData);
        res.json(response.data);

    } catch (error) {
        console.error("Fel vid anrop till API:", error);
        res.status(500).send("Ett fel inträffade vid anrop till API");
    }
});


app.put("/earring/:id", async (req, res) => {
    try {
        const earringId = parseInt(req.params.id);
        const earringData = req.body; 
        const response = await axios.put(`https://glammor20240116153727.azurewebsites.net/Earring/${earringId}`, earringData);

        if(response.status === 200){

            res.json("Successfully updated");
        } else {
            res.status(response.status).send("Uppdateringen misslyckades")
        }


    } catch (error) {
        console.error("Fel vid anrop till API:", error);
        res.status(500).send("Ett fel inträffade vid anrop till API!");
    }
});

app.delete("/earring/:id", async (req, res) => {
    try {
        const idToDelete = parseInt(req.params.id, 10)
        const earringToDelete = await axios.delete(`https://glammor20240116153727.azurewebsites.net/Earring/${idToDelete}`);
        if(!earringToDelete.data){
            return res.status(404).send("Earring not found!")
        }
        res.json("Successfully deleted");
    } catch (error) {
        console.error("Fel vid anrop till Minimal API:", error);
        res.status(500).send("Ett fel inträffade vid anrop till Minimal API");
    }
});

app.listen(port, () => {
console.log(`Servern körs på http://localhost:${port}`);
});
