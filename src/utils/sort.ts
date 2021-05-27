export function ultimatesort(tab:any[], reverse:boolean = false):any[]{
    const result =  tab.sort(
        (a:any, b:any)=>{
            const name1:string = a.name;
            const name2:string = b.name;

            return ( name1.localeCompare( name2 ));
        }
    ); 

    if( reverse )
        return result.reverse();
    else
        return result;
}