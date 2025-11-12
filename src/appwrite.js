import { Client, TablesDB, Query, ID  } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);
    
const tablesDB = new TablesDB(client);

export const updateSearchCount = async(searchTerm, movie) => {
    // 1. Use Appwrite SDK to check if the search term already exists in the database.
    try {
        const promise = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [
                Query.equal('searchTerm', searchTerm)
            ]
        });
        // 2. If it exists, increment the search count for that term.
        if (promise.rows.length > 0) {
            const existingRecord = promise.rows[0];
            const newCount = existingRecord.count + 1;

            await tablesDB.updateRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: existingRecord.$id,
                data: {
                    count: newCount,
                }
            });
        // 3. If it doesn't exist, create a new record with the search term and set the count to 1.
        } else {
            const newRow = await tablesDB.createRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: ID.unique(),
                data: {
                    searchTerm: searchTerm,
                    count: 1,
                    movie_id: movie.ids?.trakt || '',
                    poster_url: `https://${movie.images?.poster[0]}` || '',
                }
            });
        }
    } catch (error) {
        console.error('Error updating search count:', error);
    }
}