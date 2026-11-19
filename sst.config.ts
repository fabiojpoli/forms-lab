export default $config({
  app(input) {
    return {
      name: "forms-lab",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    }
  },
  async run() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      throw new Error(
        "Set NEXT_PUBLIC_API_URL to the deployed SAM API URL before deploying the frontend.",
      )
    }

    const web = new sst.aws.Nextjs("FormsLab", {
      environment: {
        NEXT_PUBLIC_API_URL: apiUrl,
      },
    })

    return { url: web.url }
  },
})
