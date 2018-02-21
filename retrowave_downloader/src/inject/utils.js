/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
function injectScript(file_path, tag) {
    tag = tag === undefined ? 'body' : tag;
    let node = document.getElementsByTagName(tag)[0];
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}

/**
 * injectCSS - Inject internal css to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal css.
 * @param  {type} tag The tag as string, where the css will be append (default: 'body').
 */
function injectCSS(file_path, tag) {
    tag = tag === undefined ? 'body' : tag;

    let node = document.getElementsByTagName(tag)[0];
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', file_path);
    node.appendChild(link);
}
