module.exports = function AmaraPluginDoclet() {

    return function createHandler(dispatch) {

        const rx = /\*\s*?@([^\s]+)\s+(ANY|ALL|SOME|NONE)?\s?(.+)/gi;

        function parseDoclets(code) {
            const doclets = {};
            let match;
            while (match = rx.exec(code)) {
                doclets[match[1]] = {
                    quantifier: (match[2] || 'ALL').toUpperCase(),
                    value: match[3]
                }
            }
            return doclets;
        }

        function onTransform({ctx, code}) {
            ctx.state.doclets = parseDoclets(code);
        }

        function getDoclets(ctx) {
            return ctx.state.doclets || {};
        }

        return function handle(action) {
            switch (action.type) {
            case 'core:bootstrap':
                action.payload.register('doclets', getDoclets);
                break;
            case 'bundle:transform':
                onTransform(action.payload);
                break;
            }
        };
    };

};
