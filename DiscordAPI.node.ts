import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';


export class NoPainNoGain implements INodeType {
	description: INodeTypeDescription = {
		// name of the node that the user has to type in n8n to find it
		displayName: 'NoPainNoGain',
		name: 'NoPainNoGain',
		icon: 'file:NoPainNoGain.svg',
		group: ['transform'],
		version: 1.9,
		// description of the node
		description: 'get all discord messages and unique users from a channel',
		defaults: {
			name: 'NoPainNoGain',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				// The ID of the channel to get the messages from
				displayName: 'Channel ID',
				name: 'channelId',
				type: 'string',
				default: '',
				required: true,
				description: 'The ID of the channel to get the messages from',
			},
			{
				// The amount of messages to get from the discord channel
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Max number of results to return',
				typeOptions: {},
			},
			{
				// Authentication token for the Discord API
				displayName: 'Authorization Bot Token',
				name: 'authorizationToken',
				type: 'string',
				default: '',
				required: true,
				description: 'The authorization token for the Discord API (Press "Reset token" if the token is not visible)',
			},
			{
				// shows a row with all unique message.author.username in the channel can be turned off and on
                displayName: 'Unique Users',
                name: 'uniqueUsernames',
                type: 'boolean',
                default: false,
                description: 'Whether if true, will show a row with all unique message.author.username in the channel',
            },
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// properties from the node 
		const channelId = this.getNodeParameter('channelId', 0) as string;
		const limit = this.getNodeParameter('limit', 0) as number;
		const authorizationToken = this.getNodeParameter('authorizationToken', 0) as string;
		const uniqueUsernames = this.getNodeParameter('uniqueUsernames', 0) as boolean;
		
		const items = [];

		const qs = {
			limit,
		};

		let responseData;
		try {
			responseData = await this.helpers.request({
				method: 'GET',
				qs,
				// uri for the discord api channel
				uri: `https://discord.com/api/v8/channels/${channelId}/messages`,
				headers: {
					Authorization: `Bot ${authorizationToken}`,
				},
				json: true,
			});
		} catch (error) {
			throw new NodeOperationError(this.getNode(), error);
		}

		// create a set of unique usernames
		const uniqueUsernamesSet = new Set();
        for (const message of responseData) {
            const author = message.author;
			// only add unique usernames and ignore bots
            if (author && author.username && !author.bot) {
                uniqueUsernamesSet.add(author.username);
            }
        }

		// add unique usernames to items
        if (uniqueUsernames) {
            const uniqueUsernamesArray = Array.from(uniqueUsernamesSet);
            items.push({
                json: {
                    username: uniqueUsernamesArray,
                },
            });
        }

		// add all messages to items
		for (const message of responseData) {
			items.push({
				json: message,
			});
		}

		// return the data and display in n8n when executed
		return this.prepareOutputData(items);
	}
}



