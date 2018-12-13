module.exports = (ctx) => {
    const locals = ctx.frontmatter;
          locals.globals = ctx.globals;

    return {
        plugins: {
            'posthtml-expressions': {locals: locals}
        }
    }
}