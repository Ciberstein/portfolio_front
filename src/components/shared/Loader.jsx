import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';

const Loader = () => {

  const loader = useSelector(state => state.loader);
  const dark = useSelector(state => state.dark);

  if(loader) return null;

  return createPortal((
    <div className="fixed inset-0 z-9999 bg-black/70">
      <div className="size-full bg-[url(/images/overlay-pattern.png)] flex flex-col justify-center items-center gap-6">
        <img src={dark ? "images/logo_dark.png" : "images/logo_light.png"} className="animate-spin size-12" alt="Loading..." />
      </div>
    </div>
    ), document.body
  );
}

export default Loader
