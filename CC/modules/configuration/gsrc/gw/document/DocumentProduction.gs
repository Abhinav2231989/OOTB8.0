package gw.document;

uses gw.plugin.document.IDocumentContentSource;
uses gw.plugin.document.IDocumentProduction;
uses gw.plugin.document.IDocumentTemplateSource;

uses java.lang.RuntimeException;
uses java.util.HashMap;
uses java.util.Map;

uses java.lang.IllegalArgumentException
uses gw.plugin.document.IDocumentTemplateDescriptor


/**
 * The DocumentProduction class contains methods which can be used in both.pcf configuration
 * and from rules to create Document entities from Document Templates.
 */
@Export
class DocumentProduction
{
/*******************************************************************************************
 *  Document Creation functions
 *******************************************************************************************/  
  /**
   * Create a document synchronously. Does not persist the newly generated content.
   * This method should be used when the generated content is desired for display in the UI.
   *
   * @param templateDescriptor the template used to create the document
   * @param parameters the set of objects, keyed by name, which will be supplied to the template generation process to create the document
   * @param document the Document entity corresponding to the newly generated content
   * @return A DocumentContentsInfo object with the metadata of the Document Contents, and possibly the contents themselves
   */
  public static function createDocumentSynchronously(templateDescriptor : IDocumentTemplateDescriptor, parameters : Map, document : Document) : DocumentContentsInfo {
    return getDocumentProductionPlugin().createDocumentSynchronously( templateDescriptor, parameters, document );
  }


  /**
   * Determine whether synchronous creation is supported by the IDocumentProduction plugin for
   * the specified template. Returns true if so, false otherwise. Returns false if a template cannot be found
   * with the specified name.
   * <p>
   * Note that this will refetch/parse the template if not cached, so if you have a descriptor use the
   * other method
   *
   * @deprecated use method that takes IDocumentTemplateDescriptor for I18N support
   * @param templateName the name of the template
   * @return true if synchronous creation supported
   */
  @Deprecated("use method that takes IDocumentTemplateDescriptor for I18N support")
  public static function synchronousDocumentCreationSupported(templateName : String) : boolean {
    var docTemplateSource : IDocumentTemplateSource = getDocumentTemplateSourcePlugin();
    var documentProductionPlugin : IDocumentProduction = getDocumentProductionPlugin();

    var documentTemplateDescriptor = docTemplateSource.getDocumentTemplate( templateName, null);
    if (documentTemplateDescriptor == null) {
      return false;
    } else {
      return documentProductionPlugin.synchronousCreationSupported( documentTemplateDescriptor );
    }
  }

  /**
   * Determine whether synchronous creation is supported by the IDocumentProduction plugin for
   * the specified template. Returns true if so, false otherwise. Returns false if a template cannot be found
   * with the specified name.
   *
   * @param template the template
   * @return true if synchronous creation supported
   */
  public static function synchronousDocumentCreationSupported(template : IDocumentTemplateDescriptor) : boolean {
    if (template == null) {
      return false;
    } else {
      return getDocumentProductionPlugin().synchronousCreationSupported( template );
    }
  }

  /**
   * Determine whether asynchronous creation is supported by the IDocumentProduction plugin for
   * the specified template. Returns true if so, false otherwise. Returns false if a template cannot be found
   * with the specified name.
   * <p>
   * Note that this will refetch/parse the template if not cached, so if you have a descriptor use the
   * other method
   *
   * @deprecated use method that takes IDocumentTemplateDescriptor for I18N support
   * @param templateName the name of the template
   * @return true if asynchronous creation supported
   */
  @Deprecated("use method that takes IDocumentTemplateDescriptor for I18N support")
  public static function asynchronousDocumentCreationSupported(templateName : String) : boolean {
    var docTemplateSource : IDocumentTemplateSource = getDocumentTemplateSourcePlugin();
    var documentProductionPlugin : IDocumentProduction = getDocumentProductionPlugin();

    var documentTemplateDescriptor = docTemplateSource.getDocumentTemplate( templateName, null);
    if (documentTemplateDescriptor == null) {
      return false;
    } else {
      return documentProductionPlugin.asynchronousCreationSupported( documentTemplateDescriptor );
    }
  }

  /**
   * Determine whether asynchronous creation is supported by the IDocumentProduction plugin for
   * the specified template. Returns true if so, false otherwise. Returns false if a template cannot be found
   * with the specified name.
   *
   * @param template the template
   * @return true if asynchronous creation supported
   */
  public static function asynchronousDocumentCreationSupported(template : IDocumentTemplateDescriptor) : boolean {
    if (template == null) {
      return false;
    } else {
      return getDocumentProductionPlugin().asynchronousCreationSupported( template );
    }
  }

  /**
   * Create a document synchronously and pass it to the IDocumentContentSource plugin for persistence
   * This method should be used when the document should be created and stored without any further user interaction.
   *
   * @deprecated use createDocumentSynchronously that takes IDocumentTemplateDescriptor for I18N support
   * @param templateName the id of the template to be used to create the document
   * @param parameters the set of objects, keyed by name, which will be supplied to the template generation process to create the document
   * @param document the Document entity corresponding to the newly generated content
   */
  @Deprecated("use createAndStoreDocumentSynchronously that takes IDocumentTemplateDescriptor for I18N support")
  public static function createAndStoreDocumentSynchronously(templateName : String, parameters : Map, document : Document) {
    var documentContentSource : IDocumentContentSource = getDocumentContentSourcePlugin();

    //pre-process document if needed
    document.preSynchronousStore(documentContentSource)

    var dci = createDocumentSynchronously(templateName, parameters, document);

    if (dci.ResponseType != DocumentContentsInfo.DOCUMENT_CONTENTS) {
      throw new RuntimeException("The IDocumentProduction implementation must return document contents to be called from a rule");
    }

    document.DMS = true;
    if (document.DateModified == null) {
      document.DateModified = (DateTime.now() as DateTime);
    }
    if (document.Author == null) {
      document.Author = displaykey.Java.Document.DefaultAuthor
    }
    document.MimeType = dci.ResponseMimeType
    if (documentContentSource.addDocument( dci.InputStream, document )) {
      document.setPersistenceRequired( false );
    }
  }

  /**
   * Create a document synchronously and pass it to the IDocumentContentSource plugin for persistence
   * This method should be used when the document should be created and stored without any further user interaction.
   *
   * @param template the template to be used to create the document
   * @param parameters the set of objects, keyed by name, which will be supplied to the template generation process to create the document
   * @param document the Document entity corresponding to the newly generated content
   */
  public static function createAndStoreDocumentSynchronously(template : IDocumentTemplateDescriptor, parameters : Map, document : Document) {
    var documentContentSource : IDocumentContentSource = getDocumentContentSourcePlugin();

    //pre-process document if needed
    document.preSynchronousStore(documentContentSource)

    var dci = createDocumentSynchronously(template, parameters, document);

    if (dci.ResponseType != DocumentContentsInfo.DOCUMENT_CONTENTS) {
      throw new RuntimeException("The IDocumentProduction implementation must return document contents to be called from a rule");
    }

    document.DMS = true;
    if (document.DateModified == null) {
      document.DateModified = (DateTime.now() as DateTime);
    }
    if (document.Author == null) {
      document.Author = displaykey.Java.Document.DefaultAuthor
    }
    document.MimeType = dci.ResponseMimeType
    if (documentContentSource.addDocument( dci.InputStream, document )) {
      document.setPersistenceRequired( false );
    }
  }

  /**
   * Create a document synchronously. Does not persist the newly generated content.
   * This method should be used when the generated content is desired for display in the UI.
   *
   * @deprecated use createDocumentSynchronously that takes IDocumentTemplateDescriptor for I18N support
   * @param templateId the id of the template to be used to create the document
   * @param parameters the set of objects, keyed by name, which will be supplied to the template generation process to create the document
   * @param document the Document entity corresponding to the newly generated content
   * @return A DocumentContentsInfo object with the metadata of the Document Contents, and possibly the contents themselves
   */
  @Deprecated("use createDocumentSynchronously that takes IDocumentTemplateDescriptor for I18N support")
  public static function createDocumentSynchronously(templateId : String, parameters : Map, document : Document) : DocumentContentsInfo {
    var docTemplateSource : IDocumentTemplateSource = getDocumentTemplateSourcePlugin();
    var template = docTemplateSource.getDocumentTemplate( templateId, null )
    if (template == null) {
      throw new IllegalArgumentException("Cannot find template with the ID " + templateId)
    }
    return createDocumentSynchronously(template, parameters, document)
  }

   /**
    * Create a document synchronously. Does not persist the newly generated content.
    * This method should be used when the generated content is desired for display in the UI, and when a
    * Document entity is not going to be created (for example, when simply printing some content).
    *
    * @deprecated use createDocumentSynchronously that takes IDocumentTemplateDescriptor for I18N support
    * @param templateName the id of the template to be used to create the document
    * @param parameters the set of objects, keyed by name, which will be supplied to the template generation process to create the document
    * @return A DocumentContentsInfo object with the metadata of the Document Contents, and possibly the contents themselves
    */
  @Deprecated("use createDocumentSynchronously that takes IDocumentTemplateDescriptor for I18N support")
    public static function createDocumentSynchronously(templateName : String, parameters : Map) : DocumentContentsInfo {
     var docTemplateSource : IDocumentTemplateSource = getDocumentTemplateSourcePlugin();
     var documentProductionPlugin : IDocumentProduction = getDocumentProductionPlugin();
     var documentContentsInfo = documentProductionPlugin.createDocumentSynchronously( docTemplateSource.getDocumentTemplate( templateName, null ), parameters);

     return documentContentsInfo;
    }

  /**
   * Create a document asynchronously. This means that the function will return immediately, but the actual document
   * creation will take place over an extended period of time.
   * This is a convenience method which translates the Document entity into a Map of values.
   * <p>
   * Note that the value Map will include the value of virtual properties, which will not
   * exist on the external version of the Document entity. The document production system
   * should be able to simply ignore these.
   *
   * @deprecated use createDocumentAsynchronously that takes IDocumentTemplateDescriptor for I18N support
   * @param templateName the id of the template to be used to create the document
   * @param parameters the set of objects, keyed by name, which will be supplied to the template generation process to create the document
   * @param document the Document entity corresponding to the newly generated content. The document's field values will be
   * passed to the IDocumentProduction implementation for use when the content is finally generated. Note that
   * this Document entity will be marked non-persistable, since the IDocumentProduction system should
   * create the necessary Document metadata once the creation process is complete
   * @return A URL which the user could visit to see the status of the document creation, or null if none exists
   */
  @Deprecated("use createDocumentAsynchronously that takes IDocumentTemplateDescriptor for I18N support")
  public static function createDocumentAsynchronously(templateName : String, parameters : Map, doc : Document) : String {
    var fieldValues = new HashMap();

    var properties = Document.Type.EntityProperties;
    for (var docProperty in properties) {
      if (docProperty.Readable && docProperty.Writable) {
        //Only include the true properties which can be retrieved here and set on entity created in the plugin
        fieldValues.put( docProperty.Name, docProperty.Accessor.getValue( doc ) )
      }
    }

    // Mark the supplied document as non-persistable, as noted above
    doc.setPersistenceRequired( false );

    return createDocumentAsynchronously(templateName, parameters, fieldValues);
  }

  /**
   * Create a document asynchronously. This means that the function will return immediately, but the actual document
   * creation will take place over an extended period of time.
   * This method should be called when the creation process will take place over an extended period of time. The external
   * document production system is responsible for creating a Document entity (if desired) when the creation is complete.
   *
   * @param template the template to be used to create the document
   * @param parameters the set of objects, keyed by name, which will be supplied to the template generation process to create the document
   * @param fieldValues a set of values, keyed by field name, which should be set on the Document entity which is eventually created
   * at the end of the asynchronous creation process.
   * @return A URL which the user could visit to see the status of the document creation, or null if none exists
   */
  public static function createDocumentAsynchronously(template : IDocumentTemplateDescriptor, parameters : Map, fieldValues : Map) : String {
    var documentProductionPlugin : IDocumentProduction = getDocumentProductionPlugin();
    getDocumentContentSourcePlugin(); // throw an exception early if can not get

    return documentProductionPlugin.createDocumentAsynchronously( template, parameters, fieldValues );
  }

  /**
   * Create a document asynchronously. This means that the function will return immediately, but the actual document
   * creation will take place over an extended period of time.
   * This method should be called when the creation process will take place over an extended period of time. The external
   * document production system is responsible for creating a Document entity (if desired) when the creation is complete.
   *
   * @deprecated use createDocumentAsynchronously that takes IDocumentTemplateDescriptor for locale related document generation
   * @param templateName - the id of the template to be used to create the document
   * @param parameters - the set of objects, keyed by name, which will be supplied to the template generation process to create the document
   * @param fieldValues - a set of values, keyed by field name, which should be set on the Document entity which is eventually created
   * at the end of the asynchronous creation process.
   * @return A URL which the user could visit to see the status of the document creation, or null if none exists
   */
   @Deprecated("use createDocumentAsynchronously that takes IDocumentTemplateDescriptor for locale related document generation")
  public static function createDocumentAsynchronously(templateName : String, parameters : Map, fieldValues : Map) : String {
    var docTemplateSource : IDocumentTemplateSource = getDocumentTemplateSourcePlugin();
    var template = docTemplateSource.getDocumentTemplate( templateName, null )
    return createDocumentAsynchronously(template, parameters, fieldValues)
  }

/**********************************************************************************************
 * Helper functions
 **********************************************************************************************/

  /**
   * Retrieve the configured IDocumentProduction implementation
   * @return the document production plugin
   */
  public static function getDocumentProductionPlugin() : IDocumentProduction  {
    var plugin : IDocumentProduction;
    plugin = gw.plugin.Plugins.get(IDocumentProduction)
    return plugin;
  }

  /**
   * Retrieve the configured IDocumentTemplateSource implementation
   * @return the document template source
   */
  public static function getDocumentTemplateSourcePlugin() : IDocumentTemplateSource {
    var plugin : IDocumentTemplateSource;
    plugin = gw.plugin.Plugins.get(IDocumentTemplateSource)
    return plugin;
  }

  /**
   * Retrieve the configured IDocumentContentSource implementation
   * @return the document content source
   */
  public static function getDocumentContentSourcePlugin() : IDocumentContentSource {
    var plugin : IDocumentContentSource;
    plugin = gw.plugin.Plugins.get(IDocumentContentSource)
    return plugin;
  }
}
