module.exports = {
    files: [
        'Gruntfile.js',
        'build/**/*.js',
        'src/js/app/**/*.js',
        'test/unit/**/*.js'
    ],
    options: {
        preset: 'google',
        disallowEmptyBlocks: true,
        disallowKeywords: [
            'with'
        ],
        disallowKeywordsOnNewLine: [
            'else'
        ],
        validateIndentation: "\t",
        validateQuoteMarks: {
            mark: '\'',
            escape: true
        },
        maximumLineLength: null
    }
};
