var cacheManager = null;
var CACHE_INIT = false;

/**
 * This module first checks if a url has been loaded before. If it has,
 * give the saved result
 */
function CacheMan_init()
{
    if (CACHE_INIT)
        return;
    CACHE_INIT = true;
    cacheManager = new _CacheMan();

    if (typeof CACHEMAN_PRELOAD != 'undefined')
    {
        $.each(CACHEMAN_PRELOAD, function(key, value){
            cacheManager.cached[key] = value;
        });
    }
}

function _CacheMan()
{
    this.cached = {};
    return this;
}

function CacheMan_load(url)
{
    if (cacheManager.cached[url] == null)
    {
        _CacheMan_cacheURL(url, false);
        return CacheMan_load(url);
    }
    return cacheManager.cached[url];
}

function _CacheMan_cacheURL(url, async)
{
    $.ajax(url, {
        async: async,
        dataType: "html",
        success: function(data){
            cacheManager.cached[url] = data;
        }
    });
}
