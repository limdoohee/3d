import React from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
const { drop } = store;
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- View
import View from "../../_view/gallery/index.view";
//------------------------------------------------------------------------------- View

const Home = observer((props) => {
    return (
        <>
            <View {...props} store={store} />
        </>
    );
});

export default Home;
