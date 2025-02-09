import cds from "@sap/cds";
import cov2app from "@cap-js-community/odata-v2-adapter";

cds.on("bootstrap", (app: any) => {
    app.use(cov2app());
});

export default cds.server;