// Builds the multiple-choice option lists (eras, authors, genres) from the
// pieces in musics.json, so the quiz no longer needs a static choices.json.

// Unique values, keeping the order they first appear in musics.json.
function uniqueInOrder(values) {
    let seen = [];
    for (let value of values) {
        if (!seen.includes(value)) seen.push(value);
    }
    return seen;
}

// "Franz Joseph Haydn" -> "Haydn". A credit naming more than one person
// ("Martin O'Donnell & Michael Salvatori") is kept whole.
function shortenAuthor(author) {
    if (author.includes('&')) return author;
    let parts = author.trim().split(/\s+/);
    return parts[parts.length - 1];
}

// A short label is only safe if it appears in exactly one composer's name:
// an answer is graded with answer.includes(buttonText), so a label that is
// also part of another composer's name would mark a wrong button correct.
// Anything ambiguous falls back to the full name.
function labelAuthors(authors) {
    return authors.map(author => {
        let label = shortenAuthor(author);
        let matches = authors.filter(other => other.includes(label)).length;
        return matches === 1 ? label : author;
    });
}

function generateChoices(pieces) {
    let eras = uniqueInOrder(pieces.map(piece => piece.era));
    let authors = labelAuthors(uniqueInOrder(pieces.map(piece => piece.author)));
    let genres = uniqueInOrder(pieces.map(piece => piece.genre));

    // "Other" is the catch-all, so it sits last like it did in choices.json.
    let other = genres.indexOf('Other');
    if (other !== -1) genres.push(genres.splice(other, 1)[0]);

    return { eras: eras, authors: authors, genres: genres };
}
