public with sharing class dynamicRowsController {
    @AuraEnabled( cacheable = true )
    public static List< Account > getAccounts() {
        return [ SELECT Id, Name, Rating FROM Account LIMIT 10 ];
       }

    @AuraEnabled
    public static void saveAccountsLwc(List<account> records){
        if(records.size()>0 && records != null){
            List<account> accs = new List<account>();
            
            for(integer i = 0; i < records.size(); i++) {
                account acc = new account();
                acc.Id = records[i].Id;
                acc.Name = records[i].Name;
                acc.Rating = records[i].Rating;
                accs.add(acc);
            }
            
            upsert accs;
        }
    }
    
}