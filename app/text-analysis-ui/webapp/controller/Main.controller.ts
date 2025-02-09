import Controller from "sap/ui/core/mvc/Controller";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import MessageToast from "sap/m/MessageToast";
import Input from "sap/m/Input";
import Text from "sap/m/Text";
import BusyIndicator from "sap/ui/core/BusyIndicator";

/**
 * @namespace textanalysisui.controller
 */
export default class Main extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void { }


    public onAnalyzePress(): void {
        const oView = this.getView();
        const oInput = oView?.byId("inputText") as Input;
        const oResultText = oView?.byId("resultText") as Text;
        const sText = oInput.getValue();

        if (!sText) {
            MessageToast.show("Please enter some text to analyze.");
            return;
        }

        const oModel = oView?.getModel() as ODataModel;

        BusyIndicator.show(0);

        oModel.callFunction("/analyzeText", {
            method: "POST",
            urlParameters: {
                text: sText
            },
            success: (oData: any) => {
                BusyIndicator.hide();
                const responseText: string = oData?.analyzeText?.generated_text;
                console.log("Response: ", responseText);
                if (responseText) {
                    oResultText.setText(`Response: ${responseText}`);
                } else {
                    oResultText.setText("Error: No response from AI");
                }
            },
            error: () => {
                BusyIndicator.hide();
                MessageToast.show("Error analyzing text.");
            },

        });
    }
}