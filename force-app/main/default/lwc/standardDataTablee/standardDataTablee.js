import { LightningElement, wire, track } from 'lwc';

import getAccounts from '@salesforce/apex/dynamicRowsController.getAccounts';
import saveAccountsLwc from '@salesforce/apex/dynamicRowsController.saveAccountsLwc';

import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class StandardDataTable extends LightningElement {

    @track records = [];

    isEdited = false;
    showFooter = false;

    draftValues =[];
    @track wiredAccontList = [];
    lastSavedData=[];

    updateItem = [];

    @wire(getAccounts)
    wiredAccount(result) {
        const { data, error } = result;
        this.wiredAccontList = result;
        if (data) {
            this.records = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.records = undefined;
            }
        this.lastSavedData = this.records; 
        }

    updateDataValues(updateItem) {
        let copyData = JSON.parse(JSON.stringify(this.records));
        copyData.forEach((item) => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
            }
        });
        this.records = [...copyData];
        console.log('records after update data:', this.records)
    }

    handleNameChange(event) {
        let updatedItem = { Id: event.target.dataset.id, Name: event.target.value };
        console.log('updatedItem:', updatedItem);
        this.updateDataValues(updatedItem);
        this.showFooter = true;
    }

    inlineEditingHandler(event) {
        this.isEdited = true;
    }
    onCancel() {
        this.showFooter = false;
    }
    onSave(event) {
        saveAccountsLwc({records : this.records})
        .then(() => {
            
            this.dispatchEvent(
                new ShowToastEvent({
                    title : 'Success',
                    message : `Records saved succesfully!`,
                    variant : 'success',
                }),
            )
            return refreshApex(this.wiredAccontList).then(() => {
                        this.isEdited = false;
                        this.showFooter = false;
                    }); 
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        })
    }
    
}