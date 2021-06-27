const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://demo:demo123@demo.nvwrp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useCreateIndex :true
})