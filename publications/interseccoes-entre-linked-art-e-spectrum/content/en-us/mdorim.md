[slide 3]

As a fundamental part in the development of a plugin like this, we need to define the data model for the operations of reading, writing, editing, and removal of the data at the system. For this purpose, we have developed the Data Model for Organization and Representation of Museum Information (Mdorim), which uses Linked Art as the primary model for the entities described by the system, and introduces some new entities and interfaces for a more comprehensive interaction in a Collection Management System.

[slide 4]

The model extends the user creation system of WordPress and introduces four new user roles: Curatorship (curator), Museology (museologist), Assistance (assistant), and Research (researcher), where each of these roles comes with a set of permissions and access restrictions to the system's metadata. We also have system options, such as the ability to import and export data, general settings, and integrations, used to store configuration data, such as an API key for a cloud storage that holds digital objects like records in images, videos, and other media. We have also the edit History entity, responsible for intercepting any action of a user in the system and recording the change. The Procedure Entity is responsible for describing the Spectrum Procedures within the System and the Mapping entity that describes how can we represent other data models using Linked Art.

All of these elements were developed in JSON-Schema and MySQL schemas that describe the database tables. In this discussion, due to time constraints, I would like to focus only on the model, especially on the intersections between Linked Art and Spectrum, and not on the MySQL schemas.
