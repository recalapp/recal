var cacheManager = null;
var CACHE_INIT = false;

function CacheMan_init()
{
    if (CACHE_INIT)
        return;
    CACHE_INIT = true;
    cacheManager = new _CacheMan();
    if (typeof CACHEMAN_PRELOAD != 'undefined')
    {
        setTimeout(function(){
            for (var i = 0; i < CACHEMAN_PRELOAD.length; i++) {
                _CacheMan_cacheURL(CACHEMAN_PRELOAD[i], false);
            };
        }, 1 * 1000);
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
