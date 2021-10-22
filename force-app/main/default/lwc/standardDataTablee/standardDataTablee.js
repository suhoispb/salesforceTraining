import { LightningElement, wire, track } from 'lwc';

import getAccounts from '@salesforce/apex/dynamicRowsController.getAccounts';
import saveAccountsLwc from '@salesforce/apex/dynamicRowsController.saveAccountsLwc';
// import deleteAccounts from '@salesforce/apex/dynamicRowsController.saveAccountsLwc';

import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class StandardDataTable extends LightningElement {

    @track records = [];

    isNameEdited = false;
    isRatingEdited = false;
    showFooter = false;

    @track wiredAccontList = [];
    lastSavedData= [];

    @track showModal = false;
    @track record = {};

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
        this.updateDataValues(updatedItem);
        this.showFooter = true;
    }
    handleRatingChange(event) {
        let updatedItem = { Id: event.target.id.slice(0,18), Rating: event.target.value };
        this.updateDataValues(updatedItem);
        this.showFooter = true;
    }

    inlineEditingNameHandler(event) {
        this.isNameEdited = true;
    }
    inlineEditingRatingHandler(event) {
        this.isRatingEdited = true;
        
    }
    onCancel(event) {
        event.preventDefault();
        this.records = JSON.parse(JSON.stringify(this.lastSavedData));
        this.showFooter = false;
        this.isNameEdited = false;
        this.isRatingEdited = false;
    }
    onSave(event) {
        saveAccountsLwc({records : this.records})
        .then(() => {
            
            this.dispatchEvent(
                new ShowToastEvent({
                    title : 'Success',
                    message : `Record saved succesfully!`,
                    variant : 'success',
                }),
            )
            return refreshApex(this.wiredAccontList).then(() => {
                        this.isNameEdited = false;
                        this.isRatingEdited = false;
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
    // deleteRecHandler(event) {
    //     const recId = event.currentTarget.dataset.id;
    //     console.log('recID:', recId)
                
    //     deleteAccounts({toDeleteId : recId})
    //     .then(() => {
    //         this.dispatchEvent(
    //             new ShowToastEvent({
    //                 title : 'Success',
    //                 message : `Record deleted succesfully!`,
    //                 variant : 'success',
    //             }),
    //         )
    //         return refreshApex(this.wiredAccontList).then(() => {console.log('success deleting')})
    //     })
    //     .catch(error => {
    //         this.dispatchEvent(
    //             new ShowToastEvent({
    //                 title: 'Error deleting record',
    //                 message: error.body.message,
    //                 variant: 'error'
    //             })
    //         );
    //         console.log('error deleting',error.body)
    //     })
    // }
    // deleteRecHandler(event) {

    // }
    closeModal() {
        this.showModal = false;
    }
    refreshApex() {
        refreshApex(this.wiredAccontList);
    }
    deleteRecHandler(event) {
        this.record = event.currentTarget.dataset.id;
        console.log('rowID:', this.record)
        this.showModal = true;
    }
    
}
// https://cunning-narwhal-3nlsvm-dev-ed.my.salesforce.com