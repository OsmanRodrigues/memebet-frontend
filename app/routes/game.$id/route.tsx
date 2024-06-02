import { useParams } from '@remix-run/react';

export default function Game() {
    const param = useParams();
    console.log('param ->', param);
    return <p>Game selected: {param.id}</p>;
}
