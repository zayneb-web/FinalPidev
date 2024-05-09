const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;

const stripe = require('stripe')(STRIPE_SECRET_KEY)

const renderBuyPage = async(req,res)=>{

    try {
        
        res.render('buy', {
            key: STRIPE_PUBLISHABLE_KEY,
            amount:25
         })

    } catch (error) {
        console.log(error.message);
    }

}

const payment = async(req,res)=>{

    try {

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Sandeep Sharma',
        address: {
            line1: '115, Vikas Nagar',
            postal_code: '281001',
            city: 'Mathura',
            state: 'Uttar Pradesh',
            country: 'India',
        }
    })
    .then((customer) => {
 
        return stripe.charges.create({
            amount: req.body.amount,     // amount will be amount*100
            description: req.body.productName,
            currency: 'INR',
            customer: customer.id
        });
    })
    .then((charge) => {
        res.redirect("/success")
    })
    .catch((err) => {
        res.redirect("/failure")
    });


    } catch (error) {
        console.log(error.message);
    }

}

const success = async(req,res)=>{

    try {
        
        res.render('success');

    } catch (error) {
        console.log(error.message);
    }

}

const failure = async(req,res)=>{

    try {
        
        res.render('failure');

    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    renderBuyPage,
    payment,
    success,
    failure
}
