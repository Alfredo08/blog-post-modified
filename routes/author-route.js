const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const jsonParser = bodyParser.json();
const { Authors } = require( './../models/authors-model' );

const authorRouter = express.Router();

authorRouter.post( '/add-author', jsonParser, ( req, res ) => {
    const { firstName, lastName, id } = req.body;

    // Add validations here

    const newAuthor = {
        firstName,
        lastName,
        id,
        comments : []
    };

    Authors
        .createAuthor( newAuthor )
        .then( author => {
            return res.status( 201 ).json( author );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

authorRouter.get( '/authors', ( req, res ) => {
    Authors
        .getAllAuthors()
        .then( authors => {
            return res.status( 200 ).json( authors );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

module.exports = authorRouter;