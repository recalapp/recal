var cacheManager = null;
var CACHE_INIT = false;

function CacheMan_init()
{
    if (CACHE_INIT)
        return;
    CACHE_INIT = true;
    cacheManager = new _CacheMan();
}

function _CacheMan()
{
    this.cached = {};
    return this;
}

function CacheMan_load(url)
{
    if (cacheManager.cached[url] == null)
        _CacheMan_cacheURL(url);
    return cacheManager.cached[url];
}

function _CacheMan_cacheURL(url)
{
    $.ajax("popup-template", {
        async: false,
        dataType: "html",
        success: function(data){
            cacheManager.cached[url] = data;
        }
    });
}
