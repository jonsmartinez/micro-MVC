/*
	Browser DB

	File: browser_db.js (Version: 0.3)
	Description: This is the browser DB JS file.

	Coded by George Delaportas (G0D)
    Copyright (C) 2017
    Open Software License (OSL 3.0)
*/

// Browser DB
function browser_db()
{
	var bdb = this;
	var selected_record = null;

	// Model
	function model_class()
	{
		// Initialize records
		this.db_records = [];
	}

	// View
	function view_class()
	{
		// Reload data inside the records list if local storage has previously saved data
		this.reload_data = function()
		{
			var records = localStorage.getItem('db_records');

			if (!records)
				return false;

			// Populate records DB
			bdb.model.db_records = JSON.parse(records);

			return true;
		};
	}

	// Controller
	function controller_class()
	{
		var me = this;

		// Add record
		this.add_record = function(record)
		{
			if (!utils.validation.misc.is_object(record))
				return false;

			if (me.check_duplicates(record.id))
				return false;

			var new_record_id = 1;
			var max_record_id = bdb.model.db_records.length - 1;

			if (bdb.model.db_records.length > 0)
				new_record_id = bdb.model.db_records[max_record_id].id + 1;

			record.id = new_record_id;

			bdb.model.db_records.push(record);

			localStorage.setItem('db_records', JSON.stringify(bdb.model.db_records));

			if (!bdb.view.reload_data())
				return false;

			return true;
		};

		// Get record
		this.get_record = function(record_id)
		{
			if (!utils.validation.numerics.is_number(record_id))
				return false;

			var i = 0;

			if (!bdb.view.reload_data())
				return false;

			for (i = 0; i < bdb.model.db_records.length; i++)
			{
				if (bdb.model.db_records[i].id == record_id)
				{
					bdb.selected_record = bdb.model.db_records[i];

					return bdb.selected_record;
				}
			}

			return false;
		};

		// Save record
		this.save_record = function(record)
		{
			if (!utils.validation.misc.is_object(record))
				return false;

			if (!me.check_duplicates(record.id))
				return false;	

			var i = 0;
			var updated_record = null;

			for (i = 0; i < bdb.model.db_records.length; i++)
			{
				if (bdb.model.db_records[i].id == record.id)
				{
					bdb.model.db_records[i] = record;
					
					localStorage.setItem('db_records', JSON.stringify(bdb.model.db_records));

					if (!bdb.view.reload_data())
						return false;

					return true;
				}
			}

			return false;
		};

		// Delete record
		this.delete_record = function(record_id)
		{
			if (!utils.validation.numerics.is_number(record_id))
				return false;

			var i = 0;

			for (i = 0; i < bdb.model.db_records.length; i++)
			{
				if (bdb.model.db_records[i].id == record_id)
				{
					localStorage.clear();

					bdb.model.db_records.splice(i, 1);

					localStorage.setItem('db_records', JSON.stringify(bdb.model.db_records));

					if (!bdb.view.reload_data())
						return false;

					return true;
				}
			}

			return false;
		};

		// Empty storage
		this.empty_storage = function()
		{
			bdb.model.db_records = [];

			localStorage.clear();

			return null;
		};

		// Check for duplicates
		this.check_duplicates = function(record_id)
		{
			if (!utils.validation.numerics.is_number(record_id))
				return false;

			var i = 0;

			if (!bdb.view.reload_data())
				return false;

			for (i = 0; i < bdb.model.db_records.length; i++)
			{
				if (bdb.model.db_records[i].id == record_id)
					return true;
			}

			return false;
		};
	}

	// Initialize and check for Local Storage support (Edge & IE are buggy - Firefox, Chrome & Opera are fine)
	function init()
	{
		if (typeof(Storage) === 'undefined')
			return false;

		// Get API calls ready
		bdb.model = new model_class();
		bdb.view = new view_class();
		bdb.controller = new controller_class();

		if (!bdb.view.reload_data())
			return false;

		return bdb;
	}

	var utils = new vulcan();

	// Intialize
	init();
}
