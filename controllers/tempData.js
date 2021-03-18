const data = { imei_data: { "131491002235": ["867218059181875"], "131491002423": ["866314052076492", "866314052075916"], "131491002424": ["866356057605411", "866356057608530"] }, invoice_info: { type_name: "01GTKT0/001", invoice_number: "0007425", invoice_sign: "BK/20E", invoice_date: "2021-03-17" }, po: "01700PO2103464464", mst: "0312798017" };

module.exports = {
    getPurchaseOrrder: function (req, res) {
        res.status(200).send({
            success: "true",
            data
        });
    }
}
