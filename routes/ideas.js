var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var {ensureAuthentication} = require('../helpers/auth');

//Load Idea Model
require('../models/Idea');
var Idea = mongoose.model('ideas');


router.get('/', ensureAuthentication, (req, res) => {
    Idea.find({user: req.user.id})
    .sort({date: 'desc'})
    .then(ideas => {
        res.render('ideas/index', {
            ideas: ideas
        });
    });
});

router.get('/edit/:id', ensureAuthentication, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        if (idea.user != req.user.id) {
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/ideas');
        }
        else {
            res.render('ideas/edit', {
                idea: idea
            });
        }
    });
    
});

router.get('/add', ensureAuthentication, (req, res) => {
    res.render('ideas/add');
});

router.post('/', ensureAuthentication, (req, res) => {
    let errors = [];
    if(!req.body.title) {
        errors.push({
            text: 'Please add a title'
        });
    }
    if(!req.body.details) {
        errors.push({
            text: 'Please add some details'
        });
    }
    if(errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }
    else {
        var newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        };
        new Idea(newUser)
        .save()
        .then(idea => {
            req.flash('success_msg', 'Idea added!');
            res.redirect('/ideas');
        });
    }
});

//Edit idea
router.put('/:id', ensureAuthentication, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Idea updated!');
            res.redirect('/ideas');
        });
    });
});


//Delete idea
router.delete('/:id', ensureAuthentication, (req, res) => {
    Idea.remove({
        _id: req.params.id
    })
    .then(() => {
        req.flash('success_msg', 'Idea removed successfully!');
        res.redirect('/ideas');
    });
});

module.exports = router;