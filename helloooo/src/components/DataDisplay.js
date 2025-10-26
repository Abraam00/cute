import React, { useEffect, useState } from "react";

const DataDisplay = () => {
	const [data, setData] = useState(null);

	useEffect(() => {
		fetch(process.env.PUBLIC_URL + "/data.json")
			.then((res) => res.json())
			.then((json) => setData(json))
			.catch((err) => console.error("Error loading JSON:", err));
	}, []);

	if (!data) return <p>Loading...</p>;

	return (
		<div>
			<h2>{data.title}</h2>
			<ul>
				{data.items.map((item) => (
					<li key={item.id}>{item.name}</li>
				))}
			</ul>
		</div>
	);
};

export default DataDisplay;
