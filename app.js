const express=require('express');
const stripe=require('stripe')(require('./setup/keys').stripeSecretKey);
const bodyparser=require('body-parser');
const ejs=require('ejs'),
app=express(),
port=process.env.PORT||3000;

//ejs middleware
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(express.static('./public'));


//index route
app.get('/',(req,res)=>{
    res.render('index',{
        spk:require('./setup/keys').stripePublishableKey
    });
});

//charge route
app.post('/charge',(req,res)=>{
    const amount=2500;
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken
    })
    .then(customer=>stripe.charges.create({
        amount,
        description:'Web Dev course',
        currency:'usd',
        customer:customer.id
    }))
    .then(charge=>res.render('main'));

});

//success
// app.get('/success',(req,res)=>res.render('main'));



app.listen(port,()=>console.log(`Server is running on port ${port}`));

