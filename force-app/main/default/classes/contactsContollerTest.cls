@isTest
public with sharing class contactsContollerTest {
    @isTest
      static void getContactsListTest() {
         Test.startTest();
         List<Contact> conList = contactsContoller.getContactsList();
         Test.stopTest();
         System.assert(conlist.isEmpty());
      }
}

//сделал запрос и пришел ответ, либо сделал запрос, но ничего не пришло.
