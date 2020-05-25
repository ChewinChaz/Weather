<aura:application extends="force:slds">
	<aura:attribute name="query" type="String" />
	<aura:attribute name="page" type="String" />
	<c:weather query="{!v.query}" page="{!v.page}" />
</aura:application>	
