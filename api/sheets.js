const { GoogleSpreadsheet } = require('google-spreadsheet');

export default async function handler(req, res) {
  try {
    const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
    
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    
    const commandes = rows.slice(-50).map(row => ({
      nom: row['NOM & PRÉNOM :'],
      date: row['DATE DE LIVRAISON :'],
      parfum: row['PARFUMS :'],
      parts: row['Nombre de parts :'],
      adresse: row['ADRESSE DE LIVRAISON :'],
      telephone: row['NUMÉRO DE TÉLÉPHONE :'],
      montant: row['Montant total de votre commande (€)'],
    }));
    
    res.status(200).json({ commandes });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
