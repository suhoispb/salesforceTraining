import { LightningElement, track, wire } from 'lwc';
import getLeadList from "@salesforce/apex/leadsController.getLeadList";
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: "Name", fieldName: "leadUrl", type: "url", typeAttributes: {
        label: { fieldName: "Name" },
        target: "_self"
      }
    },
    { label: "Title", fieldName: "Title", editable: true },
    { label: "Phone", fieldName: "Phone", editable: true },
  ];
export default class LeadsTable extends LightningElement {
    
    columns = columns;
    @track leads;
    @track wiredLeadList=[];

    handleSave(event) {
        console.log(event.detail.draftValues)
        const recordInputs =  JSON.parse(JSON.stringify(event.detail.draftValues)).slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        console.log(recordInputs);
        recordInputs.map(recordInput => updateRecord(recordInput));
        return refreshApex(this.wiredLeadList);    
    }

    @wire(getLeadList)
    wiredLead(result) {
    this.wiredLeadList = result;
    const { data, error } = result;
    if (data) {
      this.leads = data.map((row) => {
        return { ...row, leadUrl: `/lightning/r/Lead/${row.Id}/view` };
      });
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.leads = undefined;
    }
  }
}