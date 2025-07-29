import fetchAPI from "./api";

const INVESTOR_PORTAL_QUERY = `
  query InvestorPortal {
    page(id: "1597", idType: DATABASE_ID) {
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
    }
  }
`;

export default async function getInvestorPortal() {
  const data = await fetchAPI(INVESTOR_PORTAL_QUERY);
  return {
    folders: data?.page?.investorPortal?.folderStructure?.folders || [],
    regulatoryInformation: data?.page?.regulatoryInformation?.regulatoryInformation || []
  };
} 