var cacheManager = null;
var CACHE_INIT = false;

function Cache_init()
{
    if (CACHE_INIT)
        return;
    CACHE_INIT = true;
    cacheManager = Cache_new();
}

function Cache_new()
{
    ret = {cached: {}};
    return ret;
}

function Cache_load(url)
{
    if (cacheManager.cached[url] == null)
        _Cache_cacheURL(url);
    return cacheManager.cached[url];
}

function _Cache_cacheURL(url)
{
    $.ajax("popup-template", {
        async: false,
        dataType: "html",
        success: function(data)
        {
            cacheManager.cached[url] = data;
        }
    });

}
