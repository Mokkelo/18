var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM opiskelija ORDER BY idOpiskelija desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/opinto/index.ejs
            res.render('opinto',{data:''});   
        } else {
            // render to views/opinto/index.ejs
            res.render('opinto',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('opinto/add', {
        Etunimi: '',
        Sukunimi: ''        
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let Etunimi = req.body.Etunimi;
    let Sukunimi = req.body.Sukunimi;
    let errors = false;

    if(Etunimi.length === 0 || Sukunimi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('opinto/add', {
            Etunimi: Etunimi,
            Sukunimi: Sukunimi
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            Etunimi: Etunimi,
            Sukunimi: Sukunimi
        }
        
        // insert query
        dbConn.query('INSERT INTO opiskelija SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('opinto/add', {
                    Etunimi : form_data.Etunimi,
                    Sukunimi: form_data.Sukunimi                    
                })
            } else {                
                req.flash('success', 'Opiskelija successfully added');
                res.redirect('/opinto');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM opiskelija WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Book not found with id = ' + id)
            res.redirect('/opinto')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('opinto/edit', {
                title: 'Edit Book', 
                id: rows[0].id,
                name: rows[0].name,
                author: rows[0].author
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let idOpiskelija = req.params.idOpiskelija;
    let Etunimi = req.body.Etunimi;
    let Sukunimi = req.body.Sukunimi;
    let errors = false;

    if(Etunimi.length === 0 || Sukunimi.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('opinto/edit', {
            id: req.params.id,
            Etunimi: Etunimi,
            Sukunimi: Sukunimi
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            Etunimi: Etunimi,
            Sukunimi: Sukunimi
        }
        // update query
        dbConn.query('UPDATE opiskelija SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('books/edit', {
                    id: req.params.id,
                    Etunimi : form_data.Etunimi,
                    Sukunimi: form_data.Sukunimi    
                })
            } else {
                req.flash('success', 'Book successfully updated');
                res.redirect('/opinto');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM books WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/books')
        } else {
            // set flash message
            req.flash('success', 'Book successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/books')
        }
    })
})

module.exports = router;