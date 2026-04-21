import fetchAPI from "./api";

const INVESTOR_PORTAL_QUERY = `
  query InvestorPortal($id: ID!, $asPreview: Boolean!) {
    page(id: $id, idType: DATABASE_ID, asPreview: $asPreview) {
      investorPortal {
        folderStructure {
          folders {
            folderName
            contents {
              itemType
              fileName
              fileUpload {
                link
                mediaItemUrl
              }
              subfolderName
              contents {
                fileName
                fileUpload {
                  link
                  mediaItemUrl
                }
              }
            }
          }
        }
      }
      regulatoryInformation {
        regulatoryInformation {
          description
          title
          file {
            link
            mediaItemUrl
          }
        }
      }
      shareholderPortalStatement {
        statement
      }
    }
  }
`;

export default async function getInvestorPortal(preview = false) {
  const data = await fetchAPI(INVESTOR_PORTAL_QUERY, {
    variables: { id: "1597", asPreview: preview },
    preview,
  });
  return {
    folders: data?.page?.investorPortal?.folderStructure?.folders || [],
    regulatoryInformation: data?.page?.regulatoryInformation?.regulatoryInformation || [],
    shareholderPortalStatement: data?.page?.shareholderPortalStatement?.statement || []
  };
} 