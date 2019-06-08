if (process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: 'mongodb+srv://aba:aba@clusteraba-s2n2k.mongodb.net/notebook-app?retryWrites=true&w=majority'};
}
else {
    module.exports = {mongoURI: 'mongodb://localhost/notebook-app'};
}