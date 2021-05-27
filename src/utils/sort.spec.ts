import {ultimatesort} from "./sort";
describe( 
    "ultimatesort test suite", 
    ()=>{

        it(
            "should sort elements by name on alphabetical ASC order, a -> z", 
            ()=>{
                const tab:any[] = [
                    {name: "Antoine"},
                    {name: "Sirage"},
                    {name: "Cédric"},
                    {name: "Thomas"},
                    {name: "Jeanne"},
                    {name: "Soraya"},
                    {name: "Jonathan"}
                ]; 

                const expectedResult:any[] = [
                    {name: "Antoine"},
                    {name: "Cédric"},
                    {name: "Jeanne"},
                    {name: "Jonathan"},
                    {name: "Sirage"},
                    {name: "Soraya"},
                    {name: "Thomas"}
                ];

                const result:any[] = ultimatesort(tab); 

                expect(result).toEqual( expectedResult);
            }
        )

        it(
            "should sort elements by name on alphabetical DESC order, z -> a", 
            ()=>{
                const tab:any[] = [
                    {name: "Antoine"},
                    {name: "Sirage"},
                    {name: "Cédric"},
                    {name: "Thomas"},
                    {name: "Jeanne"},
                    {name: "Soraya"},
                    {name: "Jonathan"}
                ]; 

                const expectedResult:any[] = [
                    {name: "Thomas"},
                    {name: "Soraya"},
                    {name: "Sirage"},
                    {name: "Jonathan"},
                    {name: "Jeanne"},
                    {name: "Cédric"},
                    {name: "Antoine"}
                ];

                const result:any[] = ultimatesort(tab, true); 

                expect(result).toEqual( expectedResult);
            }
        )

    }
)