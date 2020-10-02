const stripe = require('stripe')('sk_test_51HXRRaAnJHG3hnJPntqnfWdGfTSmOGFeivHRB53O2Uf2RheDEZtVUA9Utug5GiRbsiJssKcYWlDEUMCVicKYuCZS00aATaLnhb');
const express = require('express');
const nodemailer=require('nodemailer')
const bodyParser=require('body-parser');
const mysql=require('mysql')
var con=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"1234",
  database:"shop"
})
con.connect((err)=>{
  if(err) throw err;
  else{
    console.log("connected")
  }
})

const app = express();
app.use(bodyParser());
app.use(express.static('.'));
app.get('/',(req,res)=>{
  res.sendFile('index.html',{root:__dirname})

})
app.get('/payment',(req,res)=>{
  res.sendFile('payment.html',{root:__dirname})

})
var tokenn;
app.post('/payment',(req,res)=>{
 
  var charge=()=>{
      var param={}
      param.card={
        number:(req.body.cardnumber),
        exp_month:2,
        exp_year:req.body.expyear,
        cvc:req.body.cvv,
  
      }
      stripe.tokens.create(param,(err,token)=>{
        if(err){
          console.log(err)
        }
        else{
          var param={
            amount:'80000',
            currency:'INR',
            source:token.id,
            description:'firsttime'
      
          }
          console.log(tokenn)
          stripe.charges.create(param,(err,charge)=>{
            if(err){
              console.log(err)
            }
            else{
              // var trans=nodemailer.createTransport({
              //   service:'gmail',
              //   auth:{
              //     user:'sahaorchid722@gmail.com',
              //     pass:'Aa@98300203'
              //   }
              // })
              // var mailOptions={
              //   from:'sahaorchid722@gmail.com',
              //   to:'sahashyama3@gmail.com',
              //   text:'congrates! payment successfull'
              //   html:<h1>token.receipt_url</h1>
              // }
              // trans.sendMail(mailOptions,(err,info)=>{
              //   if(err){
              //     console.log(err)
              //   }
              //   else{
              //     console.log("done")
              //   }
              // })
              let customer={idcustomer:'12',id:token.id,email:req.body.email,location:req.body.address}
              let sql='INSERT INTO customer SET?'
              let query=con.query(sql,customer,(err,result)=>{
                if(err) throw err;
                console.log("success");
              })

            }
      
          })
        }
      })
  }
 charge();
 res.sendFile('pay.html',{root:__dirname})

})



app.listen(4242, () => console.log('Running on port 4242'));