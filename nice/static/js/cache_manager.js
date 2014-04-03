var cacheManager = null;
var CACHE_INIT = false;

function Cache_init()
{
    if (CACHE_INIT)
        return;
    CACHE_INIT = true;
    cacheManager = this;
}

function cacheManager()
{
    return this;
}
