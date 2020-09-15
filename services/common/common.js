const db = require('../../models');

exports.validateEmail = (email) =>{
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
        return (true)
    }
    return (false)
}

exports.getCompanyNamebyUID = (companyUID) => {
    // db.Company.findOne({
    //     where: {
    //         companyUID: companyUID
    //     },
    //     raw: true,
    //     attributes: ['companyName']
    // }).then((dbCompany) => {
    //     return dbCompany.companyName;
    // });

    (async ()=>{
        try {
            const cc = await db.Company.findOne({
                where: {
                    companyUID: companyUID
                },
                raw: true,
                attributes: ['companyName']
            });
            const companyName = cc.companyName;
            console.log(32, companyName);
            return companyName;
        }
        catch(err){
            console.log(err);
        }  
        })();
}