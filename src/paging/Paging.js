class Paging{
    constructor( el = "" , config = {} ){
        this.el = el;
        this.config = config;
        this.curr = 1;
        this.events = {
            change : []
        }
        this.config.limit = Math.max( 2 ,this.config.limit );
        this.init();
    };
    init(){
        this.createPages( this.config.limit );
    };
    change(){
        if( this.curr >= ( this.config.limit / 2 ) + 1 && this.curr <= this.config.max - 2 ) {
            this.createPages( this.curr + 1 );
        }
        if( this.curr > this.config.max - 2 ) {
            this.createPages( this.config.max );
        }
        if( this.curr < this.config.limit ) {
            this.createPages( this.config.limit );
        }
        this.fire("change");
    };
    createPages( limit ){
        var elems = [];

        elems.push(`<span class="first"></span>`);
        elems.push(`<span class="prev"></span>`);
        if( this.curr > this.config.limit - 1 && this.config.max > this.config.limit && this.curr != 1 ) {
            elems.push(`<span>...</span>`);
        }
        for( var i = limit - ( this.config.limit - 1 ); i <= limit; i ++ ) {
            var span = `<span class="${ i == this.curr ? 'active page' : 'page' }" data-key="${ i }">${ i }</span>`;
            elems.push( span );
        }
        if( limit < this.config.max ) {
            elems.push(`<span>...</span>`);
        }

        elems.push(`<span class="next"></span>`);
        elems.push(`<span class="last"></span>`);

        this.el.innerHTML = `<div>${ elems.join("") }</div>`;
        this.eventData();
    };
    createNode( nodeName , attrs = {} ){
        var node = document.createElement( nodeName );
        for( var a of attrs ) {
            node[a] = attrs[a];
        }
        return node;
    };

    eventData(){
        var nodes = this.el.getElementsByTagName("span");
        let pageNode = this.el.getElementsByClassName("page");
        var first = nodes[0],
            last = nodes[nodes.length - 1],
            prev = nodes[1],
            next = nodes[nodes.length - 2];

        prev.onclick = () => this.prev();
        next.onclick = () => this.next();
        first.onclick = () => this.first();
        last.onclick = () => this.last();
        for( let i = 0; i < pageNode.length; i ++ ) {
            pageNode[i].onclick = () => this.currPage( parseInt( pageNode[i].getAttribute("data-key") ) );
        }
    };
    prev(){
        if( this.curr == 1 ) return;
        this.curr = this.curr - 1 == 0 ? 1 : this.curr - 1;
        this.change();
    };
    next(){
        if( this.curr == this.config.max ) return;
        this.curr = this.curr + 1 > this.config.max ? this.config.max : this.curr + 1;
        this.change();
    };
    first(){
        if( this.curr == 1 ) return;
        this.curr = 1;
        this.change();
    };
    last(){
        if( this.curr == this.config.max ) return;
        this.curr = this.config.max;
        this.change();
    };
    currPage( idx ){
        if( idx == this.curr ) return;
        this.curr = idx;
        this.change();
    };
    on( evt , cb ){
        if ( !this.events[evt] ) {
            this.events[evt] = [];
        };
        this.events[evt].push( cb );
    };
    fire( evt ){
        var _ = this;
        if( this.events[evt] instanceof Array ){
            var handlers = this.events[evt];
            handlers.forEach(function ( v , k ){
                v( _ );
            })
        }
    };
}



export default Paging;