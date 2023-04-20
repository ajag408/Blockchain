async function run() {
  const { create } = await import("ipfs-http-client");
  const ipfs = await create();

  // we added three attributes, add as many as you want!
  const metadata = {
    path: "/",
    content: JSON.stringify({
      name: "Shiva",
      attributes: [
        {
          trait_type: "Peace",
          value: "108",
        },
        {
          trait_type: "Love",
          value: "54",
        },
        {
          trait_type: "Color",
          value: "White",
        },
      ],
      // update the IPFS CID to be your image CID
      image:
        "https://ipfs.io/ipfs/QmVKvMqwvcsp5x2GpCQ48ancBAYgSUgn2cQRzVvMbqnUUJ?filename=shiva.jpg",
      description: "Equipoised",
    }),
  };

  const result = await ipfs.add(metadata);
  console.log(result);

  process.exit(0);
}

run();
