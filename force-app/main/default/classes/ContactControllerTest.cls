@isTest 
private class ContactControllerTest  {

      @isTest
      static void getContactListWithoutStringTest() {
         Test.startTest();
         List<Contact> contactList = ContactController.getContactList('');
         Test.stopTest();
         System.assertEquals(1, contactlist.size());
      }
      @isTest
      static void getContactListWithStringTest() {
         Test.startTest();
         List<Contact> contactList = ContactController.getContactList('Sean');
         Test.stopTest();
         System.assertEquals(1, contactlist.size());
    }
      @isTest
      static void getContactListWithoutResultTest() {
         Test.startTest();
         List<Contact> contactList = ContactController.getContactList('Arnold');
         Test.stopTest();
         System.assertEquals(0, contactlist.size());
    }
}
