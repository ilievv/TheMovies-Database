/* globals Promise */

import firebaseDb from 'firebase-database';
import moviesDb from 'movies-database';

class UserModel {
    signIn(email, password) {
        // TODO: Validate Input

        return firebaseDb.signInWithEmail(email, password)
            .catch(error => Promise.reject(error));
    }

    signUp(email, password) {
        // TODO: Validate Input

        return firebaseDb.createUserWithEmail(email, password)
            .catch(error => Promise.reject(error));
    }

    signOut() {
        return firebaseDb.signOut()
            .catch(error => Promise.reject(error));
    }

    addToWatchlist(movieId) {
        return new Promise(resolve => {
            const userId = localStorage.getItem('userUid');
            firebaseDb.addToWatchlist(userId, movieId)
                .then(data => resolve(data));
        });
    }

    removeFromWatchlist(movieId) {
        return new Promise(resolve => {
            const userId = localStorage.getItem('userUid');
            firebaseDb.removeFromWatchlist(userId, movieId)
                .then(data => resolve(data));
        });
    }

    getWatchlist() {
        return new Promise((resolve, reject) => {
            const userId = localStorage.getItem('userUid');
            firebaseDb.getUsersWatchlist(userId)
                .then(moviesIds => moviesDb.getMoviesDetails(moviesIds))
                .then(moviesDetails => resolve(moviesDetails))
                .catch(error => reject(error));
        });
    }

    getWatchlistHandlebarsObject(movies) {
        return new Promise((resolve, reject) => {
            let handlebarsObject = { movies: [], isWatchlist: true };

            movies.forEach(movie => {
                let title = movie.original_title;
                let id = movie.id;
                let description = movie.overview;
                let posterSrc = this._getImageUrl(movie.poster_path);
                let isWatchlist = true;
                let isLoggedIn = localStorage.getItem('userUid') !== 'null' ? true : false;

                handlebarsObject.movies.push({ title, id, description, posterSrc, isWatchlist, isLoggedIn });
            });

            if (!handlebarsObject.movies.length) {
                reject("No results found.");
            }

            resolve(handlebarsObject);
        });
    }

    _getImageUrl(imageSrc) {
        let imageUrl = imageSrc ? `https://image.tmdb.org/t/p/w500${imageSrc}` :
            'http://clipartix.com/wp-content/uploads/2016/08/Questions-powerpoint-question-mark-clip-art.jpg';

        return imageUrl;
    }
}

const userModel = new UserModel();
export default userModel;