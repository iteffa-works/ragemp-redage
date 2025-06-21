using System.Collections.Concurrent;
using System.Collections.Generic;
using GTANetworkAPI;
using NeptuneEvo.Accounts.Models;
using NeptuneEvo.BattlePass.Models;
using NeptuneEvo.Character.Models;
using NeptuneEvo.Chars.Models;
using NeptuneEvo.Core;
using NeptuneEvo.Fractions.Models;
using NeptuneEvo.Functions;
using NeptuneEvo.Organizations.Models;
using NeptuneEvo.Players.Models;
using NeptuneEvo.Players.Phone.Models;
using NeptuneEvo.Quests.Models;
using NeptuneEvo.Table.Tasks.Models;

namespace NeptuneEvo.Handles
{
    public class ExtPlayer : Player
    {
        // Constructor
        public ExtPlayer(NetHandle handle) : base(handle)
        {
        }

        // Character name
        private string CharacterName;

        // Set character name
        public void SetName(string name)
        {
            this.CharacterName = name;
            
            if (SessionData != null)
                SessionData.Name = name;
        }

        // Get character name
        public string GetName() => this.CharacterName;


        // Character UUID
        private int UUID;

        // Set UUID
        public void SetUUID(int uuid)
        {
            this.UUID = uuid;
        }

        // Get UUID
        public int GetUUID() => this.UUID;

        // Player session data
        public SessionData SessionData;

        // Set session data
        public void SetSessionData(SessionData sessionData)
        {
            SessionData = sessionData;
        }

        // Flag for saving character data on restart
        public bool IsRestartSaveCharacterData = false;

        // Character data
        public CharacterData CharacterData;

        // Set character data
        public void SetCharacterData(CharacterData characterData)
        {
            CharacterData = characterData;
        }

        // Flag for saving account data on restart
        public bool IsRestartSaveAccountData = false;

        // Account data
        public AccountData AccountData;

        // Set account data
        public void SetAccountData(AccountData accountData)
        {
            AccountData = accountData;
        }

        // Player collision shapes
        public List<ExtColShapeData> ColShapesData;

        // Add collision shape data
        public void AddColShapeData(ExtColShapeData сolShapeData)
        {
            if (ColShapesData == null)
                ColShapesData = new List<ExtColShapeData>();
            
            if (InteractionCollection.isFunction(сolShapeData.ColShapeId.ToString()))
                ColShapesData.Add(сolShapeData);
            else
                ColShapesData.Insert(0,сolShapeData);

        }

        // Remove collision shape data
        public void DeleteColShapeData(ExtColShapeData сolShapeData)
        {
            if (ColShapesData != null && ColShapesData.Contains(сolShapeData))
                ColShapesData.Remove(сolShapeData);
        }

        // Player appearance customization
        public PlayerCustomization Customization;

        // Set customization
        public void SetCustomization(PlayerCustomization сustomization)
        {
            Customization = сustomization;
        }

        // Active quest
        public PlayerQuestModel Quest;

        // Assign a quest to the player
        public void SelectQuest(PlayerQuestModel quest)
        {
            Quest = quest;
        }

        // Clear the active quest
        public void ClearQuest()
        {
            Quest = null;
        }

        // Player accessories
        public ConcurrentDictionary<int, InventoryItemData> Accessories = null;

        // Set accessory in slot
        public void SetAccessories(int slotId, InventoryItemData item)
        {
            if (Accessories == null)
                Accessories = new ConcurrentDictionary<int, InventoryItemData>();

            Accessories[slotId] = item;
        }

        // Remove accessory from slot
        public void DeleteAccessories(int slotId)
        {
            if (Accessories != null && Accessories.ContainsKey(slotId))
                Accessories.TryRemove(slotId, out _);
        }

        // Check if accessory exists in slot
        public bool IsAccessories(int slotId)
        {
            if (Accessories != null)
                return Accessories.ContainsKey(slotId);

            return false;
        }

        // Clear all accessories
        public void ClearAccessories()
        {
            Accessories = null;
        }

        // Player skin
        public PedHash Skin = PedHash.Skidrow01AMM;

        // Get skin
        public PedHash GetSkin()
        {
            return Skin;
        }

        // Battle Pass data
        public BattlePassData BattlePassData;

        // Set Battle Pass data
        public void SetBattlePassData(BattlePassData battlePassData)
        {
            BattlePassData = battlePassData;
        }

        // Mission data
        public MissionData MissionData;

        // Set mission task
        public void SetMissionTask(MissionData missionData)
        {
            MissionData = missionData;
            
            if (missionData.Tasks.Count == 0)
                BattlePass.Repository.UpdateMission(this);
        }

        // Phone data
        public PhoneData PhoneData;

        // Set phone data
        public void SetPhoneData(PhoneData phoneData)
        {
            PhoneData = phoneData;
        }

        // Key clamp data
        public KeyClampData KeyClampData;

        // Set key clamp data
        public void SetKeyClampData(KeyClampData keyClampData = null)
        {
            KeyClampData = keyClampData;
        }

        // Organization data
        public OrganizationMemberData OrganizationData;

        // Set organization data
        public void SetOrganizationData(OrganizationMemberData organizationData = null)
        {
            OrganizationData = organizationData;
        }

        // Fraction data
        public FractionMemberData FractionData;

        // Set fraction data
        public void SetFractionData(FractionMemberData fractionData = null)
        {
            FractionData = fractionData;
        }

        // Organization tasks
        public TableTaskPlayerData[] OrganizationTasksData = null;

        // Fraction tasks
        public TableTaskPlayerData[] FractionTasksData = null;

        // Outgoing sync flag for invisibility
        public bool OutgoingSyncDisabled { get; set; }
    }
}