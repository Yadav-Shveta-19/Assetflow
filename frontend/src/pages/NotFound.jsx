import { Link } from "react-router-dom";
import { Button } from "../components/Button";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold">404</h1>
        <p className="mt-2 text-slate-500">The AssetFlow page you requested does not exist.</p>
        <Link to="/" className="mt-4 inline-block"><Button>Back to dashboard</Button></Link>
      </div>
    </div>
  );
}
