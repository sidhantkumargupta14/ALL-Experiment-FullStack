import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../features/posts/postsSlice";

function SearchBar() {

  const dispatch = useDispatch();

  const search = useSelector(
    state => state.posts.search
  );

  return (

    <div className="search-box">

      <input
        type="text"
        placeholder="🔍 Search posts, author or platform..."
        value={search}
        onChange={(e)=>
          dispatch(setSearch(e.target.value))
        }
      />

    </div>

  );

}

export default SearchBar;